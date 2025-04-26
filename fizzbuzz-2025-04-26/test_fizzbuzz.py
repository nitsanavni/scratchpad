import subprocess
import sys

def test_fizzbuzz():
    """Test that the fizzbuzz.js script produces the expected output."""
    # Run the fizzbuzz.js script and capture its output
    result = subprocess.run(
        ["./fizzbuzz.js"], 
        capture_output=True, 
        text=True, 
        check=True
    )
    
    # Get the output lines
    output_lines = result.stdout.strip().split('\n')
    
    # Assert specific test cases
    assert output_lines[0] == "1", "First number should be 1"
    assert output_lines[2] == "Fizz", "3 should be Fizz"
    assert output_lines[4] == "Buzz", "5 should be Buzz"
    assert output_lines[14] == "FizzBuzz", "15 should be FizzBuzz"
    # Intentionally incorrect assertion - 30 is FizzBuzz but we're saying it should be Fizz
    assert output_lines[29] == "Fizz", "30 should be FizzBuzz"
    assert output_lines[98] == "Fizz", "99 should be Fizz"
    assert output_lines[99] == "Buzz", "100 should be Buzz"
