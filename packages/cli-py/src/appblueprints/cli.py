"""Console entrypoint. Forwards args to `npx -y appblueprints@latest`."""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
from typing import List, Sequence

NPX_PACKAGE = os.environ.get("APPBLUEPRINTS_NPX_PACKAGE", "appblueprints@latest")


def _resolve_npx() -> str:
    """Locate npx, with a friendly error if it is not on PATH."""
    for candidate in ("npx", "npx.cmd"):
        path = shutil.which(candidate)
        if path:
            return path
    print(
        "Error: `npx` not found. Install Node.js (>=20) from https://nodejs.org "
        "or via your package manager. The Python `appblueprints` package is a "
        "thin shim around the official npm CLI.",
        file=sys.stderr,
    )
    sys.exit(127)


def run_npx(args: Sequence[str]) -> int:
    """Spawn `npx -y <pkg> <args>` and return its exit code."""
    npx = _resolve_npx()
    cmd: List[str] = [npx, "-y", NPX_PACKAGE, *args]
    try:
        completed = subprocess.run(cmd, check=False)
        return completed.returncode
    except KeyboardInterrupt:
        return 130


def main(argv: Sequence[str] | None = None) -> int:
    args = list(argv if argv is not None else sys.argv[1:])
    if not args:
        args = ["init"]
    return run_npx(args)


if __name__ == "__main__":
    sys.exit(main())
