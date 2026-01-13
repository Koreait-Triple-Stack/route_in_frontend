import { EXERCISE_TAGS } from "../../constants/exerciseTags";

export const TAG_ID_TO_LABEL = Object.fromEntries(
    EXERCISE_TAGS.map((tag) => [tag.id, tag.label])
);
