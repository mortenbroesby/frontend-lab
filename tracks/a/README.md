# Track A · Modern Web Capabilities

For you if you want to understand what a browser can do beyond ordinary page UI. Choose one capability and one question.

**You need:** Node 24, npm, an editor and a current browser for the shared React app.

## Get a first result

[Start with the browser bootstrap](bootstrap.md). Create your own demo and change one visible behaviour: a shape, a control or a response to input.

**Success check:** Your demo opens from the gallery and your change responds to input. Navigate away and back; it still works without console errors.

## Explore further

| Starting point | First observation | Optional stretch |
| --- | --- | --- |
| Visual interaction | Change one SVG shape with a control or pointer. | Add a few D3 nodes and one force, or compare SVG with Canvas. |
| Responsive computation | Send a small value to a Worker and render its reply. | Add progress or cancellation; compare interaction responsiveness under a bounded workload. |
| Local real-time messages | Open the existing signals example in two same-origin tabs and send a message. | Share a palette or quiz event and handle invalid messages without a feedback loop. |

**Communication boundary:** the existing example uses BroadcastChannel within one browser context. It does not connect phones or separate computers. WebRTC needs signalling for peer setup; WebSockets need a server. Neither service is included in this baseline, so there is no cross-device startup command here.

[Worked references](examples.md) cover D3, SVG, Workers and tab messages. Start with one small piece; the completed examples are separate from your bootstrap.

## Show what you discovered

Show the interaction, name the API or library you used, and explain one browser constraint you discovered.

Capture a few [findings](../findings.md), then use the [contribution guide](../../CONTRIBUTING.md) to share code or notes. You may build towards a reference or pursue your own idea.

[Choose another track](../../README.md#tracks)
