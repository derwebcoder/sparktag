export const config = {
	getNotSoSecretSecret: () => {
		// yes, it's fine this is in here, this is just a very basic "authentication" system
		// to keep the usage limited to few people right now.
		return "d4461bfeabd1ee6b5679a671129efc92a170992994e63f64d0e6dd02a18f67aa";
	},
};
