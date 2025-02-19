#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "pygame",
# ]
# ///

import pygame
import sys
import random

# Initialize pygame
pygame.init()

# Set up display
width, height = 600, 400
cell_size = 20
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Snake Game")
clock = pygame.time.Clock()
fps = 10

# Colors
black = (0, 0, 0)
red = (255, 0, 0)
green = (0, 255, 0)
white = (255, 255, 255)

# Snake starting position and body
snake_pos = [100, 40]
snake_body = [[100, 40], [80, 40], [60, 40]]
direction = "RIGHT"
change_to = direction

# Food position
food_pos = [
    random.randrange(0, width // cell_size) * cell_size,
    random.randrange(0, height // cell_size) * cell_size,
]
food_spawn = True

score = 0

def show_score():
    font = pygame.font.SysFont("times new roman", 20)
    score_surface = font.render(f"Score: {score}", True, white)
    score_rect = score_surface.get_rect(topleft=(10, 10))
    screen.blit(score_surface, score_rect)

def game_over():
    font = pygame.font.SysFont("times new roman", 50)
    game_over_surface = font.render(f"Game Over - Score: {score}", True, red)
    game_over_rect = game_over_surface.get_rect(center=(width / 2, height / 2))
    screen.blit(game_over_surface, game_over_rect)
    pygame.display.flip()
    pygame.time.wait(2000)
    pygame.quit()
    sys.exit()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                change_to = "UP"
            elif event.key == pygame.K_DOWN:
                change_to = "DOWN"
            elif event.key == pygame.K_LEFT:
                change_to = "LEFT"
            elif event.key == pygame.K_RIGHT:
                change_to = "RIGHT"

    # Prevent snake from reversing directly
    if change_to == "UP" and direction != "DOWN":
        direction = "UP"
    if change_to == "DOWN" and direction != "UP":
        direction = "DOWN"
    if change_to == "LEFT" and direction != "RIGHT":
        direction = "LEFT"
    if change_to == "RIGHT" and direction != "LEFT":
        direction = "RIGHT"

    # Move snake
    if direction == "UP":
        snake_pos[1] -= cell_size
    elif direction == "DOWN":
        snake_pos[1] += cell_size
    elif direction == "LEFT":
        snake_pos[0] -= cell_size
    elif direction == "RIGHT":
        snake_pos[0] += cell_size

    # Snake body mechanism
    snake_body.insert(0, list(snake_pos))
    if snake_pos == food_pos:
        score += 1
        food_spawn = False
    else:
        snake_body.pop()

    # Food spawning
    if not food_spawn:
        food_pos = [
            random.randrange(0, width // cell_size) * cell_size,
            random.randrange(0, height // cell_size) * cell_size,
        ]
        food_spawn = True

    # Fill background
    screen.fill(black)

    # Draw snake and food
    for segment in snake_body:
        pygame.draw.rect(
            screen, green, pygame.Rect(segment[0], segment[1], cell_size, cell_size)
        )
    pygame.draw.rect(
        screen, red, pygame.Rect(food_pos[0], food_pos[1], cell_size, cell_size)
    )

    # Show score
    show_score()

    # Check for collisions with boundaries
    if (
        snake_pos[0] < 0
        or snake_pos[0] >= width
        or snake_pos[1] < 0
        or snake_pos[1] >= height
    ):
        game_over()

    # Check for collisions with itself
    for block in snake_body[1:]:
        if snake_pos == block:
            game_over()

    pygame.display.update()
    clock.tick(fps)