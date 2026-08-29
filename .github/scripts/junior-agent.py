#!/usr/bin/env python3
"""Thin launcher for the Junior Agent package.

Kept at this path for backward compatibility with the workflow invocation:
    python3 .github/scripts/junior-agent.py
The actual implementation lives in .github/scripts/junior_agent/.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from junior_agent.main import main

if __name__ == "__main__":
    main()
