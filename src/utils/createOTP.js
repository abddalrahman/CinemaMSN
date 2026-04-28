function FuncCreateOTP (length) {
	let otp = '';
	for(let i = 0; i < length; i++){
		let randNum = Math.floor(Math.random() * 10);
		otp += randNum.toString();
	}

	return otp
}
export default FuncCreateOTP