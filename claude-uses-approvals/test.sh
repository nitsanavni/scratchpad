if [ -z "$1" ]; then
    uv tool run ruff check .
    uv tool run black .
    uv tool run mypy .
    uv run pytest -q --approvaltests-use-reporter='PythonNativeReporter'
else
    uv tool run ruff check $1
    uv tool run black $1
    uv tool run mypy $1
    uv run pytest -q --approvaltests-use-reporter='PythonNativeReporter' $1
fi

