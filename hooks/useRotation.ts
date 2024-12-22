import {
	useAnimatedStyle,
	withRepeat,
	withSequence,
	withTiming,
	Easing,
} from "react-native-reanimated";

export const useRotationAnimation = () => {
	return useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotate: withRepeat(
						withSequence(
							withTiming(360 + "deg", {
								duration: 1000,
								easing: Easing.linear,
							}),
							withTiming(0 + "deg", { duration: 1000, easing: Easing.linear }),
						),
						-1,
						false,
					),
				},
			],
		};
	});
};
