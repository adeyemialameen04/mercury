import Animated from "react-native-reanimated";
import { Button } from "./ui/button";
import { Loader } from "~/lib/icons/Loader";
import { useRotationAnimation } from "~/hooks/useRotation";
import { Text } from "./ui/text";
import { ComponentProps } from "react";
import { cn } from "~/lib/utils";

interface ActionButtonProps extends ComponentProps<typeof Button> {
	text: string;
	textClassname?: string;
	loading: boolean;
}

export default function ActionButton({
	loading,
	text,
	textClassname,
	className,
	...props
}: ActionButtonProps) {
	const rotationAnimation = useRotationAnimation();

	return (
		<Button
			disabled={loading || props.disabled}
			className={cn("gap-3 items-center flex-row", className)}
			{...props}
		>
			{loading ? (
				<Animated.View style={rotationAnimation}>
					<Loader className="text-primary" size={18} strokeWidth={1.25} />
				</Animated.View>
			) : null}
			<Text className={textClassname}>{text}</Text>
		</Button>
	);
}
