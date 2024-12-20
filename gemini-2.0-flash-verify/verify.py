import os
import difflib
import subprocess


def verify(thing, test_name, extension=""):
    """
    Verifies a string or printable object against an approved file.

    Args:
        thing: The object to verify (should have a __str__ method).
        test_name: The name of the test (used for the filename).
        extension: Optional extension for the approved file (default is "").
                   If provided without a leading dot, it will be added.
    """
    if extension and not extension.startswith("."):
        extension = "." + extension

    filename = f"{test_name}.approved{extension}"
    received_filename = f"{test_name}.received{extension}"

    try:
        with open(filename, "r") as f:
            approved_content = f.readlines()  # Read lines with newlines
    except FileNotFoundError:
        print(f"Creating new approval file: {filename}")
        with open(filename, "w") as f:
            approved_content = []  # Initialize as empty list

    thing_str = str(thing)
    thing_lines = thing_str.splitlines(keepends=True) # Split into lines, keeping newlines

    with open(received_filename, "w") as f:
        f.writelines(thing_lines) # Write lines to file
        f.write("\n")

    if thing_lines == approved_content:
        print(f"Test '{test_name}' passed.")
        if os.path.exists(received_filename):
            os.remove(received_filename)
        return

    print(f"Test '{test_name}' failed. Diff:")

    diff = difflib.unified_diff(
        thing_lines,
        approved_content,
        fromfile=received_filename,
        tofile=filename,
    )
    print("".join(diff))

    try:
        subprocess.run(["d.sh", received_filename, filename], check=False)
    except FileNotFoundError:
        try:
            subprocess.run(["bcompare", received_filename, filename], check=False)
        except FileNotFoundError:
            print("d.sh or bcompare not found. Please install a diff tool.")

    raise AssertionError(
        f"Test '{test_name}' failed. See diff above and {filename} vs {received_filename}"
    )
