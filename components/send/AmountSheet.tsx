import { TouchableOpacity, View } from "react-native";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { SheetProps } from "react-native-actions-sheet";
import { Text } from "../ui/text";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Muted, Small } from "../ui/typography";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Button } from "../ui/button";
import ActionButton from "../ActionButton";

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

export default function AmountSheet(props: SheetProps<"amount-sheet">) {
	const buyParams = props.payload?.buyParams;
	const tokenData = props.payload?.token;
	const payloadBalance = Number.parseFloat(props.payload?.balance as string);
	const balAmt =
		payloadBalance / Math.pow(10, tokenData.decimals ? tokenData.decimals : 6);
	const tokenBalance = balAmt.toString();
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
		resolver: zodResolver(createSchema(tokenBalance as string)),
	});

	const onSubmit = async (data: FormData) => {
		console.log(data);
	};

	const handleMaxPress = () => {
		setValue("amount", tokenBalance, { shouldValidate: true });
	};

	return (
		<ActionSheet id={props.sheetId} closable={false}>
			<View className="p-6">
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
						/>
						{errors.amount && (
							<Text className="text-red-500 text-sm">
								{errors.amount.message}
							</Text>
						)}
						<View className="gap-1">
							<Label nativeID="fee">Fee</Label>
							<Controller
								control={control}
								name="fee"
								render={({ field: { onChange, value } }) => (
									<View className="flex flex-row items-center">
										<ToggleGroup
											value={value}
											onValueChange={onChange}
											className="flex-wrap items-start"
											type="single"
										>
											<ToggleGroupItem
												value="0.001"
												aria-label="0.001 STX"
												size={"sm"}
											>
												<Text>0.001</Text>
											</ToggleGroupItem>
											<ToggleGroupItem
												value="0.01"
												aria-label="0.01 STX"
												size={"sm"}
											>
												<Text>0.01</Text>
											</ToggleGroupItem>
											<ToggleGroupItem
												value="0.1"
												aria-label="0.1 STX"
												size={"sm"}
											>
												<Text>0.1</Text>
											</ToggleGroupItem>
											<ToggleGroupItem
												value="0.5"
												aria-label="0.5 STX"
												size={"sm"}
											>
												<Text>0.5</Text>
											</ToggleGroupItem>
											<ToggleGroupItem
												value="block"
												aria-label="block"
												size={"sm"}
											>
												<Text>BLOCK</Text>
											</ToggleGroupItem>
										</ToggleGroup>
										<Text className="font-semibold text-lg ml-2">STX</Text>
									</View>
								)}
							/>
							{errors.fee && (
								<Text className="text-red-500 text-sm">
									{errors.fee.message}
								</Text>
							)}
						</View>
						<View className="gap-3 flex-row mt-4">
							<Button
								variant={"outline"}
								className="flex-1"
								onPress={async () => SheetManager.hide("amount-sheet")}
							>
								<Text>Cancel</Text>
							</Button>

							<ActionButton text="Send" loading={true} className="flex-1" />
						</View>
					</View>
				) : (
					<Small>Token data not found</Small>
				)}
			</View>
		</ActionSheet>
	);
}
