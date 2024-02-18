import JSZip from "jszip";
import {
  ChallengeData,
  TaskData,
} from "../pages/administration/AdminChallenge";

export async function exportTask(task: TaskData, root: JSZip = new JSZip()) {
  const { tests, ...config } = task;
  root.file(
    "config.json",
    JSON.stringify({
      examples: tests
        .filter((x) => x.is_example)
        .map((x) => ({
          name: `test_${x.test_number.toString().padStart(2, "0")}.txt`,
          explanation: x.explanation,
        })),
      ...config,
    })
  );
  root.folder("input");
  root.folder("output");
  task.tests.forEach((test, i) => {
    root
      .folder("input")
      ?.file(
        `test_${test.test_number.toString().padStart(2, "0")}.txt`,
        test.input
      );
    root
      .folder("output")
      ?.file(
        `test_${test.test_number.toString().padStart(2, "0")}.txt`,
        test.output
      );
  });
  return root;
}

export async function exportChallenge(challenge: ChallengeData) {
  const result = new JSZip();
  const { tasks, ...config } = challenge;
  result.file("config.json", JSON.stringify(config));
  tasks.forEach((task, i) => {
    exportTask(
      task,
      result.folder(
        `task_${task.task_number.toString().padStart(2, "0")}`
      ) as JSZip
    );
  });
  return result;
}

export async function downloadZip(zip: JSZip, name: string) {
  const a = document.createElement("a");
  a.style.display = "none";
  a.download = name;
  a.href = `data:application/zip;base64,${await zip.generateAsync({
    type: "base64",
  })}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
