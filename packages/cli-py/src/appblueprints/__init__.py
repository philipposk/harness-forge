"""AppBlueprints Python wrapper.

Thin shim that shells out to the official npm-distributed CLI via `npx`.
Pure-Python reimplementation lives behind an env flag for future work.
"""

from .cli import main, run_npx

__version__ = "0.0.1"
__all__ = ["main", "run_npx", "__version__"]
