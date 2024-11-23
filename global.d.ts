import React from "react";

import { MotionProps as FramerMotionProps } from "motion/react";

declare module "motion/react" {
  interface MotionProps extends FramerMotionProps {
    className?: string;
  }
}