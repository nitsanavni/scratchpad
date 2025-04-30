from docstring_parser import verify_docstring


def tictactoe_move(board, position, player):
    """
    Makes a move on the Tic-tac-toe board.

    Args:
        board: A string representation of the board (9 characters)
        position: Position to place the mark (0-8)
        player: The player making the move ('X' or 'O')

    Returns:
        Updated board string
    """
    if not (0 <= position <= 8):
        return board

    board_list = list(board)
    if board_list[position] == ".":
        board_list[position] = player

    return "".join(board_list)


def check_winner(board):
    """
    Checks if there's a winner in the Tic-tac-toe board.

    Args:
        board: A string representation of the board (9 characters)

    Returns:
        'X' if X won, 'O' if O won, 'Draw' if it's a draw, 'Playing' if the game is still in progress
    """
    # Winning patterns (rows, columns, diagonals)
    patterns = [
        (0, 1, 2),
        (3, 4, 5),
        (6, 7, 8),  # Rows
        (0, 3, 6),
        (1, 4, 7),
        (2, 5, 8),  # Columns
        (0, 4, 8),
        (2, 4, 6),  # Diagonals
    ]

    # Check for winners
    for pattern in patterns:
        if (
            board[pattern[0]] != "."
            and board[pattern[0]] == board[pattern[1]] == board[pattern[2]]
        ):
            return board[pattern[0]]

    # Check for draw or ongoing game
    if "." not in board:
        # When using the pattern XOXOXOXOX, we need a more robust check for a draw
        # For this specific board configuration, need to ensure no winning pattern
        has_x_won = any(
            board[p[0]] == board[p[1]] == board[p[2]] == "X" for p in patterns
        )
        if has_x_won:
            return "X"
        has_o_won = any(
            board[p[0]] == board[p[1]] == board[p[2]] == "O" for p in patterns
        )
        if has_o_won:
            return "O"
        return "Draw"
    else:
        return "Playing"


def test_tictactoe_move():
    """
    ['.........', 0, 'X'] -> X........
    ['.........', 4, 'O'] -> ....O....
    ['X........', 8, 'X'] -> X.......X
    ['X.O......', 3, 'O'] -> X.OO.....
    ['X.OO.....', 1, 'X'] -> XXOO.....
    ['.X.O.X..O', 6, 'O'] -> .X.O.XO.O
    ['.X.O.XO.O', 7, 'X'] -> .X.O.XOXO
    ['X........', 0, 'O'] -> X........
    ['XXXO.....', 4, 'X'] -> XXXOX....
    """

    def process_move(input_str):
        params = eval(input_str)
        return tictactoe_move(params[0], params[1], params[2])

    verify_docstring(processor_fn=process_move)


def test_check_winner():
    """
    XXX...... -> X
    ...XXX... -> X
    ......XXX -> X
    X..X..X.. -> X
    .X..X..X. -> X
    ..X..X..X -> X
    X...X...X -> X
    ..X.X.X.. -> X
    OOO...... -> O
    XXOOOXXX. -> Playing
    XXXOOOXXX -> X
    ......... -> Playing
    XOXOXOXOX -> X
    XOXXOOOXX -> Draw
    """
    # Use the enhanced automatic detection
    verify_docstring()
