const baseUrl = "https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData";

const getAllCoronas = async () => {
  const response = await fetch(baseUrl);
  return response.json();
};

export default { getAllCoronas };
