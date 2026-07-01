import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "play.rectangle.fill")
                .font(.system(size: 60))
                .foregroundColor(.red)

            Text("FeedFix for YouTube")
                .font(.title.bold())

            Text("Enable the extension in\nSafari → Settings → Extensions")
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
                .font(.callout)

            Button("Open Safari Settings") {
                if let url = URL(string: "x-apple.systempreferences:com.apple.Safari.extension-settings") {
                    NSWorkspace.shared.open(url)
                }
            }
            .buttonStyle(.borderedProminent)
            .tint(.red)
        }
        .padding(40)
        .frame(width: 360, height: 260)
    }
}
