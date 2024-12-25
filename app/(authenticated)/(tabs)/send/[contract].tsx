import React from "react";
import { validateStacksAddress } from "@stacks/transactions";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
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
import { useRouter } from "expo-router";

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

export default function Send() {
	const { tokenData } = useLocalSearchParams();
	const data = JSON.parse(tokenData);
	const router = useRouter();

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
		router.push({
			pathname: "/send/amount",
			params: {
				tokenData,
				buyParams: JSON.stringify(values),
			},
		});
		// SheetManager.show("amount-sheet", {
		// 	payload: {
		// 		buyParams: values,
		// 		token: data as FtMetadataResponse,
		// 		balance: data.balance as string,
		// 	},
		// });
	};

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
								/>
							)}
						/>
					</View>
				</CardContent>
				<CardFooter>
					<Button className="w-full" onPress={handleSubmit(onSubmit)}>
						<Text className="text-center">Next</Text>
					</Button>
				</CardFooter>
			</Card>
		</ScrollView>
	);
}
