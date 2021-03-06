import { GetServerSideProps } from "next";

import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  LinkBox,
  LinkOverlay,
  Flex,
  ScaleFade,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import PageWithLayoutType from "@/types/pageWithLayout";
import Exam from "@/layouts/exam";

type IQuestionProps = {
  id: number;
  category_id: number;
  question_id: number;
  answer: string[];
  question: string;
  total_question: number;
};

const ExamSubQuestionPage = (props: IQuestionProps) => {
  const router = useRouter();
  const [value, setValue] = useState<string | number>("1");

  function getNextRoute() {
    const next_question = props.id + 1;
    const next_category = props.question_id + 1;

    if (props.id !== props.total_question) {
      return `/exam/${props.category_id}/${props.question_id}/${next_question}`;
    } else {
      if (props.question_id !== 7) {
        return `/exam/${next_category}`;
      } else {
        return `/exam/lobby`;
      }
    }
  }

  return (
    <>
      <Box w="50%" mx="20" my="10">
        <Text fontSize="lg" fontWeight="semibold">
          {props.id}. {props.question}
        </Text>
        <RadioGroup
          onChange={(string) => setValue(string)}
          value={value}
          my="6"
        >
          <Stack direction="column" spacing="4">
            {props.answer.map((item) => (
              <Box
                p="6"
                key={item}
                cursor="pointer"
                borderWidth="1px"
                borderRadius="md"
                color={
                  value !== "1"
                    ? value === item
                      ? "gray.800"
                      : "gray.400"
                    : "gray.800"
                }
                fontWeight={value === item ? "medium" : "base"}
                boxShadow={value === item ? "outline" : ""}
                borderColor={value === item ? "blue.600" : "gray.200"}
                onClick={() => setValue(item)}
                style={{
                  WebkitTransition: "box-shadow 250ms",
                  transition: "box-shadow 250ms",
                }}
              >
                <Radio value={item} hidden>
                  {item}
                </Radio>
              </Box>
            ))}
          </Stack>
        </RadioGroup>
        <Flex alignItems="end">
          <Button onClick={() => router.push(getNextRoute())}>Next</Button>
        </Flex>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  const res = await fetch(
    `http://localhost:3001/questions/${context.params.question}?_embed=subquestions`
  );

  const data = await res.json();

  if ("questions" in data) {
    console.log(data.subquestions);
  }

  const results = data.subquestions[Number(context.params.subquestion) - 1];

  if (!results) {
    return {
      notFound: true,
    };
  }

  // Pass data to the page via props
  return {
    props: {
      id: Number(context.params.subquestion),
      category_id: Number(context.params.categories),
      question_id: Number(results.id),
      question: results.question,
      answer: results.answer,
      total_question: Object.keys(data.subquestions).length,
    },
  };
};

(ExamSubQuestionPage as PageWithLayoutType).layout = Exam;

export default ExamSubQuestionPage;
