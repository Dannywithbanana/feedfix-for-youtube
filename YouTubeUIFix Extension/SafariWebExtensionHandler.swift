import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem

        let profile: UUID?
        if #available(macOS 14.0, *) {
            profile = request?.userInfo?[SFExtensionProfileKey] as? UUID
        } else {
            profile = nil
        }

        let message: Any? = request?.userInfo?[SFExtensionMessageKey]
        os_log(.default, "Received message from browser.runtime.sendNativeMessage: %@ (profile: %@)", String(describing: message), profile.map(\.uuidString) ?? "none")

        let response = NSExtensionItem()
        response.userInfo = [SFExtensionMessageKey: ["echo": message as Any]]
        context.completeRequest(returningItems: [response])
    }
}
