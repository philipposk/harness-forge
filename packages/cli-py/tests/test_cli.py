"""Smoke tests that do not require npx (we monkeypatch subprocess.run)."""
from __future__ import annotations

import subprocess
from unittest.mock import patch

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src"
sys.path.insert(0, str(ROOT))

from appblueprints.cli import main, run_npx  # noqa: E402


class _Result:
    def __init__(self, returncode: int) -> None:
        self.returncode = returncode


@patch("shutil.which", return_value="/usr/bin/npx")
@patch("subprocess.run", return_value=_Result(0))
def test_run_npx_invokes_subprocess(mock_run, _mock_which) -> None:
    rc = run_npx(["init", "--yes"])
    assert rc == 0
    assert mock_run.called
    cmd = mock_run.call_args.args[0]
    assert cmd[0] == "/usr/bin/npx"
    assert cmd[1] == "-y"
    assert "init" in cmd
    assert "--yes" in cmd


@patch("shutil.which", return_value="/usr/bin/npx")
@patch("subprocess.run", return_value=_Result(0))
def test_main_defaults_to_init(_mock_run, _mock_which) -> None:
    rc = main([])
    assert rc == 0
