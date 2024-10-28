changes required: Create a Bun script to wrap a command and print both the original input and the command's output.

### File: `wrapped-cmd.ts`

```typescript
import { stdin, stdout } from "bun";

// Function to read from stdin
async function readStdin() {
  const decoder = new TextDecoder();
  const input = await new Response(stdin).arrayBuffer();
  return decoder.decode(input);
}

(async () => {
  const input = await readStdin();

  // Print the original input
  console.log("--- Input ---");
  console.log(input);

  // Execute the wrapped command using Bun.spawn
  const wrappedCmd = Bun.spawn({
    cmd: process.argv.slice(2), // command to wrap
    stdin: Bun.file(input),
    stdout: "pipe",
    stderr: "inherit",
  });

  const cmdOutput = await new Response(wrappedCmd.stdout).text();

  // Print the output from the wrapped command
  console.log("--- Output ---");
  console.log(cmdOutput);

  await wrappedCmd.exited;
})();
```

Use this script in Vim as `:.!bun wrapped-cmd.ts your-command`. It will display both the input and the output of the command executed through the script.
