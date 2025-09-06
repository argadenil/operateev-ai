import os
import sys
import platform
from multiprocessing import cpu_count
from llama_cpp import Llama


def _infer_fast_defaults():
    """Return fast runtime defaults tuned for macOS/Metal or CPU."""
    is_apple_silicon = platform.system() == "Darwin" and platform.machine() in {"arm64", "aarch64"}

    cores = max(1, (os.cpu_count() or cpu_count() or 4))
    n_threads = max(2, cores - 1)

    # Keep context modest for speed; override via env if needed.
    n_ctx = int(os.getenv("FAST_N_CTX", "1024"))
    # Larger batch improves throughput but must be <= n_ctx.
    n_batch_default = min(n_ctx, int(os.getenv("FAST_N_BATCH", str(max(512, n_ctx)))))
    n_batch = min(n_ctx, n_batch_default)

    n_gpu_layers = int(os.getenv("FAST_N_GPU_LAYERS", str(-1 if is_apple_silicon else 0)))
    use_mlock = os.getenv("FAST_USE_MLOCK", "0") == "1"

    return {
        "n_threads": n_threads,
        "n_threads_batch": n_threads,
        "n_ctx": n_ctx,
        "n_batch": n_batch,
        "n_gpu_layers": n_gpu_layers,
        "use_mmap": True,
        "use_mlock": use_mlock,
        # Helpful perf flags
        "f16_kv": True,
        "logits_all": False,
        # Ensure chat template matches Llama 3 Instruct
        "chat_format": "llama-3",
        "verbose": os.getenv("FAST_VERBOSE", "0") == "1",
    }


def main() -> None:
    fast = _infer_fast_defaults()

    model_path = os.getenv("LLM_MODEL_PATH", "./Meta-Llama-3.1-8B-Instruct-128k-Q4_0.gguf")
    if not os.path.exists(model_path):
        print(f"Model not found at: {model_path}\nSet LLM_MODEL_PATH or place the GGUF at that path.", file=sys.stderr)
        sys.exit(1)

    # Keep llama.cpp logs quiet by default (still override via env)
    if "LLAMA_LOG_LEVEL" not in os.environ:
        os.environ["LLAMA_LOG_LEVEL"] = os.getenv("FAST_LOG_LEVEL", "WARN")

    llm = Llama(
        model_path=model_path,
        **fast,
    )

    # Optional warm-up to compile Metal kernels and populate caches for smoother first token
    if os.getenv("FAST_WARMUP", "1") == "1":
        try:
            llm.create_chat_completion(
                messages=[{"role": "user", "content": "hi"}],
                max_tokens=1,
                temperature=0,
            )
        except Exception:
            pass

    messages = [
        {
            "role": "user",
            "content": "Write a short poem about the sea.\n\n",
        },
    ]

    # Stream tokens with buffered printing to reduce flush overhead
    try:
        stream = llm.create_chat_completion(
            messages=messages,
            max_tokens=int(os.getenv("FAST_MAX_TOKENS", "128")),
            temperature=0.7,
            stream=True,
        )
        buf, flush_every = [], 24
        stdout_write = sys.stdout.write
        stdout_flush = sys.stdout.flush
        join = "".join
        end_trigs = ("\n", ".", "!", "?")
        for chunk in stream:
            # Extract streamed token piece fast and safely
            choice0 = chunk.get("choices")
            if not choice0:
                continue
            delta = choice0[0].get("delta") or {}
            content = delta.get("content")
            if content:
                buf.append(content)
                if len(buf) >= flush_every or content.endswith(end_trigs):
                    stdout_write(join(buf))
                    stdout_flush()
                    buf.clear()
        if buf:
            stdout_write(join(buf))
            stdout_flush()
        print()
        return
    except Exception:
        pass  # fall back to non-streaming

    try:
        resp = llm.create_chat_completion(
            messages=messages,
            max_tokens=int(os.getenv("FAST_MAX_TOKENS", "128")),
            temperature=0.7,
        )
        msg = (
            resp.get("choices", [{}])[0]
            .get("message", {})
            .get("content")
        )
        if msg:
            print(msg)
            return
        txt = resp.get("choices", [{}])[0].get("text")
        if txt:
            print(txt)
            return
        print(resp)
    except Exception as e:
        print(f"Error generating completion: {e}")


if __name__ == "__main__":
    main()