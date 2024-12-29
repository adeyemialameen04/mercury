import React from "react";
import { validateStacksAddress } from "@stacks/transactions";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";

const schema = z.object({
	receiverAddr: z
		.string()
		.min(1, "Receiver address is required")
		.refine((address) => validateStacksAddress(address), {
			message: "Invalid Stacks address",
		}),
	memo: z.string().optional(),
});

export type FormData = z.infer<typeof schema>;

export default function Page() {
	const { tokenData } = useLocalSearchParams();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Safely parse tokenData
	let data;
	try {
		data = typeof tokenData === "string" ? JSON.parse(tokenData) : null;
	} catch (e) {
		console.error("Failed to parse tokenData:", e);
		data = null;
	}

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			receiverAddr: "SPQ9B3SYFV0AFYY96QN5ZJBNGCRRZCCMFHY0M34Z",
			memo: "",
		},
		resolver: zodResolver(schema),
	});

	const onSubmit = async (values: FormData) => {
		if (isSubmitting) return;

		try {
			setIsSubmitting(true);
			setError(null);

			// Validate that we have the required data
			if (!data) {
				throw new Error("Token data is missing or invalid");
			}

			// Prepare navigation params
			const navigationParams = {
				tokenData: tokenData, // Keep original tokenData
				buyParams: JSON.stringify(values),
			};

			// Navigate with error handling
			await router.push({
				pathname: "/send/step2",
				params: navigationParams,
			});
		} catch (err) {
			console.error("Navigation error:", err);
			setError(
				err instanceof Error ? err.message : "Failed to proceed to next step",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!data) {
		return (
			<ScrollView className="flex-1 p-6 py-10">
				<Card>
					<CardContent>
						<Text className="text-red-500">
							Invalid token data. Please try again.
						</Text>
					</CardContent>
				</Card>
			</ScrollView>
		);
	}

	return (
		<ScrollView className="flex-1 p-6 py-10">
			<Card className="w-full">
				<CardHeader className="items-center space-y-2">
					<Image
						source={data?.image}
						contentFit="cover"
						style={{ height: 50, width: 50, borderRadius: 25 }}
						transition={1000}
					/>
					<Text className="text-xl font-semibold">Send</Text>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<View className="gap-1 w-full">
						<Label nativeID="receiver-address">Receiver Address</Label>
						<Controller
							control={control}
							name="receiverAddr"
							render={({ field: { onChange, value, onBlur } }) => (
								<Input
									aria-labelledby="receiver-address"
									onChangeText={onChange}
									onBlur={onBlur}
									value={value}
									placeholder="SP3RTF...XPTPMZ9"
									className="w-full"
									editable={!isSubmitting}
								/>
							)}
						/>
						{errors.receiverAddr && (
							<Text className="text-red-500 text-sm">
								{errors.receiverAddr.message}
							</Text>
						)}
					</View>
					<View className="gap-1 w-full">
						<Label nativeID="memo">Memo (optional)</Label>
						<Controller
							control={control}
							name="memo"
							render={({ field: { onChange, value, onBlur } }) => (
								<Textarea
									aria-labelledby="memo"
									onChangeText={onChange}
									onBlur={onBlur}
									value={value}
									placeholder=""
									className="w-full"
									editable={!isSubmitting}
								/>
							)}
						/>
					</View>
					{error && <Text className="text-red-500 text-sm">{error}</Text>}
				</CardContent>
				<CardFooter>
					<Button
						className="w-full"
						onPress={handleSubmit(onSubmit)}
						disabled={isSubmitting}
					>
						<Text className="text-center">
							{isSubmitting ? "Processing..." : "Next"}
						</Text>
					</Button>
				</CardFooter>
			</Card>
		</ScrollView>
	);
}
