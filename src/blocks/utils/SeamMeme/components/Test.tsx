import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";

const Test = () => {
	const captureRef = useRef<HTMLDivElement | null>(null);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);

	const handleCapture = async () => {
		if (captureRef.current === null) {
			return;
		}
		const canvas = await html2canvas(captureRef.current);
		const image = canvas.toDataURL("image/png");
		setCapturedImage(image);
	};

	return (
		<div>
			<div
				ref={captureRef}
				style={{
					position: "relative",
					width: "500px",
					height: "500px",
					border: "1px solid black",
				}}
			>
				<Draggable>
					<div
						style={{
							position: "absolute",
							width: "100px",
							height: "100px",
							backgroundColor: "red",
						}}
					>
						First Div
					</div>
				</Draggable>
				<Draggable>
					<div
						style={{
							position: "absolute",
							width: "100px",
							height: "100px",
							backgroundColor: "blue",
						}}
					>
						Second Div
					</div>
				</Draggable>
			</div>
			<button onClick={handleCapture}>Capture Image</button>
			{capturedImage && (
				<div>
					<h3>Captured Image:</h3>
					<img src={capturedImage} alt="Captured Overlay" />
				</div>
			)}
		</div>
	);
};

export default Test;
