import React from "react";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
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
import { useRouter } from "expo-router";
import { Muted, Small } from "~/components/ui/typography";
import { SheetManager } from "react-native-actions-sheet";

const createSchema = (balance: string) =>
	z.object({
		amount: z
			.string()
			.min(1, "Amount is required")
			.regex(/^\d+(\.\d+)?$/, "Invalid amount")
			.refine((val) => Number(val) <= Number(balance), {
				message: "Amount exceeds available balance",
			}),
		fee: z.string().min(1, "Fee is required"),
	});

type FormData = z.infer<ReturnType<typeof createSchema>>;

export default function Page() {
	const { tokenData: tokenDataStr, buyParams: buyParamsStr } =
		useLocalSearchParams();
	const buyParams = JSON.parse(buyParamsStr);
	const tokenData = JSON.parse(tokenDataStr);
	const tokenBalance = tokenData.formattedBalAmt.toString() as string;

	const router = useRouter();

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			amount: "1",
			fee: "0.001",
		},
		resolver: zodResolver(createSchema(tokenBalance)),
	});
	console.log(JSON.stringify(tokenData, null, 2));

	const onSubmit = async (values: FormData) => {
		SheetManager.show("confirm-transaction", {
			payload: {
				tokenData,
				buyParams: {
					...buyParams,
					...values,
				},
			},
		});
	};

	const handleMaxPress = () => {
		setValue("amount", tokenBalance, { shouldValidate: true });
	};

	return (
		<ScrollView className="flex-1 p-6 py-10">
			<Card className="w-full">
				<CardHeader className="items-center space-y-2">
					<Image
						source={tokenData?.image}
						contentFit="cover"
						style={{ height: 50, width: 50, borderRadius: 25 }}
						transition={1000}
					/>
					<Text className="text-xl font-semibold">Send</Text>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<View className="">
						{tokenData ? (
							<View className="gap-2 w-full">
								<View className="flex-row justify-between items-center w-full">
									<Label nativeID="amount">{tokenData.ticker} amount</Label>
									<Muted>
										Balance: {tokenBalance} {tokenData.ticker}
									</Muted>
								</View>
								<Controller
									control={control}
									name="amount"
									render={({ field: { onChange, value, onBlur } }) => (
										<View className="relative w-full">
											<Input
												aria-labelledby="amount"
												onChangeText={onChange}
												onBlur={onBlur}
												value={value}
												placeholder=""
												className="w-full pr-16"
											/>

											<TouchableOpacity
												className="absolute right-2 top-1/2 -translate-y-1/2"
												onPress={handleMaxPress}
											>
												<Text className="text-blue-500 font-medium">MAX</Text>
											</TouchableOpacity>
										</View>
									)}
								/>{" "}
								<Muted className="self-end">
									{tokenData.currentPrice * tokenData.formattedBalAmt} USD
								</Muted>
								{errors.amount && (
									<Text className="text-red-500 text-sm">
										{errors.amount.message}
									</Text>
								)}
								<View className="flex flex-row justify-between my-3">
									<View className="flex flex-col gap-0">
										<Text>Network Fee</Text>
										<View className="flex flex-row items-center gap-2">
											<Muted>High</Muted>
											<TouchableOpacity>
												<Text>Edit</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</View>
						) : (
							<Small>Token data not found</Small>
						)}
					</View>
				</CardContent>
				<CardFooter className="">
					<Button className="w-full" onPress={handleSubmit(onSubmit)}>
						<Text>Next</Text>
					</Button>
				</CardFooter>
			</Card>
		</ScrollView>
	);
}
