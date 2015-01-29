module.exports = {
	getChecksum : function(num12){
		var num12String = String(num12);
		if(num12String.length != 12){
			throw new Error("12 chars need");
		}
		var odd = true;
		var oddSum = 0;
		var evenSum = 0;
		for(var i = 11 ; i >= 0 ; i--){
			var n = Number(num12String.charAt(i));
			if(odd){
				oddSum += n;
			}else{
				evenSum += n;
			}
			odd = !odd;
		}
		var sum = oddSum * 3 + evenSum;
		var checksum = 10 - (sum % 10);
		if(checksum === 10){
			return 0;
		}else{
			return checksum;
		}
	}
};