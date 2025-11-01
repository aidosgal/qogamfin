import { View } from "react-native";
import { Course } from "../model/types/course"
import { Text } from "react-native";

type CourseCardProps = {
    course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({course}) => {
  return (
    <View>
      <Text>{course.title}</Text>
    </View>
  )
}
