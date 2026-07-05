export async function transcribeAudio(_audioBlob: Blob): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return 'これは音声入力のモックテキストです。今日はいい天気ですね。';
}
