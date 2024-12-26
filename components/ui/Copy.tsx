import { Copy } from "~/lib/icons/Copy";
import { CheckCircle } from "~/lib/icons/CheckCircle";
import { setStringAsync } from "expo-clipboard";
import { Button } from "~/components/ui/button";
import { useState } from "react";

export default function CopyButton({ copyText }: { copyText: string }) {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		if (copyText) {
			await setStringAsync(copyText);
			setCopied(true);
			setTimeout(() => setCopied(false), 3000);
		}
	};

	return (
		<Button
			variant="outline"
			size="icon"
			onPress={copyToClipboard}
			className="flex flex-row items-center gap-2"
		>
			{copied ? (
				<CheckCircle size={14} className="text-primary" strokeWidth={1.25} />
			) : (
				<Copy size={16} className="text-primary" strokeWidth={1.25} />
			)}
		</Button>
	);
}
