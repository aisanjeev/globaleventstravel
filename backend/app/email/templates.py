"""
Email template loading and rendering with Jinja2.
"""
import os
from pathlib import Path
from typing import Any, Dict

try:
    from jinja2 import Environment, FileSystemLoader, select_autoescape
except ImportError:
    Environment = None
    FileSystemLoader = None
    select_autoescape = None

# Templates directory (next to this file)
TEMPLATES_DIR = Path(__file__).parent / "templates"


def get_env():
    """Get Jinja2 environment."""
    if Environment is None:
        raise RuntimeError("Jinja2 is required. Install with: pip install jinja2")
    return Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        autoescape=select_autoescape(["html", "xml"]),
    )


def render_template(template_name: str, context: Dict[str, Any]) -> str:
    """
    Render an email template with the given context.
    """
    env = get_env()
    template = env.get_template(template_name)
    return template.render(**context)
