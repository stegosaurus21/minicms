import JSZip from "jszip";
import { TaskData } from "../pages/administration/AdminChallenge";

export async function exportTask(task: TaskData) {
  const result = new JSZip();
  result.file(
    "config.json",
    JSON.stringify({
      weight: task.weight,
      type: task.type,
      examples: task.tests
        .filter((x) => x.is_example)
        .map((x) => ({
          name: `test_${x.test_number.toString().padStart(2, "0")}.txt`,
          explanation: x.explanation,
        })),
      constraints: task.constraints,
    })
  );
  result.folder("input");
  result.folder("output");
  task.tests.forEach((test, i) => {
    result
      .folder("input")
      ?.file(
        `test_${test.test_number.toString().padStart(2, "0")}.txt`,
        test.input
      );
    result
      .folder("output")
      ?.file(
        `test_${test.test_number.toString().padStart(2, "0")}.txt`,
        test.output
      );
  });
  downloadZip(await result.generateAsync({ type: "base64" }), "task.zip");
}

export function downloadZip(data: string, name: string) {
  const a = document.createElement("a");
  a.style.display = "none";
  a.download = name;
  a.href = `data:application/zip;base64,${data}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
