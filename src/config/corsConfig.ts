import Config from '.';
const { urlFront } = Config;

const optionCors = {
  origin: `${urlFront}`,
  methods: 'GET,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'id',
  ],
};

export { optionCors };
