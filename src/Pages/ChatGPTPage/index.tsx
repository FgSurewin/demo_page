import React from "react";
import { Container, Paper, Box, Stack, Button } from "@mui/material";
import { Configuration, OpenAIApi } from "openai";
import Dialog from "./Dialog";
import { IChoice, IUsage } from "../../types";
import { concatTokensAndTokenProbs, convertLogprobsToProbs } from "../../Utils";

export default function ChatGPTPage() {
  const is_onMount = React.useRef(false);
  const [temperature, setTemperature] = React.useState<number>(0);
  const [logprobs, setLogprobs] = React.useState<number>(3);
  const [inputPrompt, setInputPrompt] = React.useState<string>("");
  const [dialogs, setDialogs] = React.useState<
    { question: string; answer: IChoice; usage: IUsage }[]
  >([]);

  const query_answer = async (prompt: string) => {
    const configuration = new Configuration({
      apiKey: process.env.REACT_APP_NEW_CHATGPT_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    try {
      const completion = await openai.createCompletion(
        {
          model: "text-davinci-003",
          prompt: prompt,
          // stop: "<|endoftext|>",
          // top_p: 1,
          // n: 2, // Number of answers to return
          temperature: temperature,
          frequency_penalty: 0,
          presence_penalty: 0,
          max_tokens: 4000,
          logprobs: logprobs, // Return the log probabilities along with the samples. 3 means return the top 3 log probabilities.
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const usage = completion.data.usage as IUsage;
      const answerChoice = completion.data.choices[0] as IChoice;
      console.log("completion.data -> ", completion.data);
      // console.log("answerChoice -> ", answerChoice);
      setDialogs((prev) => [
        ...prev,
        { question: prompt, answer: answerChoice, usage: usage },
      ]);
    } catch (e: any) {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log(e.message);
      }
    }
  };

  React.useEffect(() => {
    if (!is_onMount.current) {
      // init_openai();
      // console.log("Test");
      is_onMount.current = true;
    }
  }, []);

  return (
    <Paper
      sx={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Paper
        sx={{
          bgcolor: "#343541",
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
      >
        <Container maxWidth="md">
          <Box>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                textAlign: "center",
                py: 4,
                position: "fixed",
                top: 0,
                zIndex: 1,
              }}
            >
              <Box
                component="textarea"
                value={inputPrompt}
                placeholder="Enter you prompt here..."
                onChange={(e) => {
                  setInputPrompt(e.currentTarget.value);
                }}
                sx={{
                  minWidth: "770px",
                  maxWidth: "800px",
                  minHeight: "50px",
                  fontSize: "1rem",
                }}
              />
              <Button
                variant="text"
                sx={{ color: "white", border: "white 1px solid" }}
                onClick={() => {
                  query_answer(inputPrompt);
                  //  Remove the prompt after submit
                  setInputPrompt("");
                }}
              >
                Submit
              </Button>
            </Stack>
          </Box>
          <Stack>
            <Box sx={{ height: "6rem" }} />
            {dialogs.length > 0 &&
              dialogs.map((dialog, index) => (
                <Box key={index}>
                  <Dialog
                    question={dialog.question}
                    answer={dialog.answer.text}
                    answerProbs={concatTokensAndTokenProbs(
                      dialog.answer.logprobs.tokens,
                      convertLogprobsToProbs(
                        dialog.answer.logprobs.token_logprobs
                      ),
                      dialog.usage.completion_tokens
                    )}
                    top_logprobs={dialog.answer.logprobs.top_logprobs}
                  />
                </Box>
              ))}
          </Stack>
        </Container>
      </Paper>
    </Paper>
  );
}
