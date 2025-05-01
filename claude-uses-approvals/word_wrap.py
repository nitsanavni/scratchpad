def word_wrap(text, column_width):
    """
    Break text into lines of specific length.

    Args:
        text: The input text to be wrapped
        column_width: The maximum width of each line

    Returns:
        String with text wrapped to the specified column width
    """
    if not text:
        return ""

    if column_width <= 0:
        return text

    # Split text into lines (handle existing line breaks)
    original_lines = text.split("\n")
    result_lines = []

    for line in original_lines:
        # If line is already shorter than column width, keep it as is
        if len(line) <= column_width:
            result_lines.append(line)
            continue

        # Process the line that needs wrapping
        current_position = 0
        while current_position < len(line):
            # Check if remainder of line fits within column width
            if len(line) - current_position <= column_width:
                result_lines.append(line[current_position:])
                break

            # Find the last space within column width
            cut_position = line.rfind(
                " ", current_position, current_position + column_width + 1
            )

            # No space found, cut at column width
            if cut_position == -1 or cut_position <= current_position:
                cut_position = current_position + column_width
                result_lines.append(line[current_position:cut_position])
                current_position = cut_position
            else:
                # Cut at the space but preserve consecutive spaces if any
                # Count the number of consecutive spaces at the cut position
                space_count = 0
                i = cut_position
                while i < len(line) and line[i] == " ":
                    space_count += 1
                    i += 1

                # Add the segment up to the space (inclusive)
                result_lines.append(line[current_position:cut_position])

                # Move past all consecutive spaces
                current_position = cut_position + space_count

    return "\n".join(result_lines)
