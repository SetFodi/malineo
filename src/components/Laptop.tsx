import { type ReactNode } from 'react';
import { motion, useMotionTemplate, useTransform, type MotionStyle, type MotionValue } from 'motion/react';
import { Keyboard } from './Keyboard';
import { Trackpad } from './Trackpad';
import type { Finger } from '../story';

export type LaptopPose = {
  /** Offset from the centre of the stage, in px. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  /** Camera height: 0 looks straight at the front edge, 90 straight down. */
  elev: MotionValue<number>;
  /** Turn around the vertical axis. Negative faces left. */
  yaw: MotionValue<number>;
  /** Lid angle: 0 closed, 90 upright. */
  lid: MotionValue<number>;
  /** Display brightness, 0 to 1. */
  screenOn: MotionValue<number>;
  /** Glow of the heart on the lid, 0 to 1. */
  glow: MotionValue<number>;
  /** How much of the greeting has been written, 0 to 1. */
  write: MotionValue<number>;
};

type Props = {
  pose: LaptopPose;
  screen: ReactNode;
  keysOn: ReadonlySet<string>;
  keysLive: ReadonlySet<string>;
  fingers?: Finger[];
  fingerMove?: number;
};

/* The base and lid are slabs: a short stack of layers gives them real edges.
   Seen from above, each layer peeks out from under the one before it, so a
   handful is enough for a solid-looking side. */
const BASE_LAYERS = 8;
const BASE_STEP = 2.75;
const LID_LAYERS = 5;
const LID_STEP = 2.2;

const baseLayers = Array.from({ length: BASE_LAYERS }, (_, i) => (
  <i
    key={i}
    className={i === 0 ? 'lt-layer is-chamfer' : i === BASE_LAYERS - 1 ? 'lt-layer is-under' : 'lt-layer'}
    style={{ transform: `translateZ(${-(i + 1) * BASE_STEP}px)` }}
  />
));
const lidLayers = Array.from({ length: LID_LAYERS }, (_, i) => (
  <i
    key={i}
    className={i === LID_LAYERS - 1 ? 'lt-layer is-chamfer' : 'lt-layer'}
    style={{ transform: `translateZ(${(i + 1) * LID_STEP}px)` }}
  />
));

function Heart() {
  return (
    <svg className="lt-heart" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="heart-fill" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="oklch(0.95 0.035 10)" />
          <stop offset="0.55" stopColor="oklch(0.885 0.06 6)" />
          <stop offset="1" stopColor="oklch(0.83 0.075 4)" />
        </linearGradient>
      </defs>
      <path
        d="M50 90C22 68 7 50 7 31 7 17 17.500 7 30.500 7 39 7 46 11.500 50 18.500 54 11.500 61 7 69.500 7 82.500 7 93 17 93 31c0 19-15 37-43 59z"
        fill="url(#heart-fill)"
        stroke="oklch(0.8 0.07 5 / 0.55)"
        strokeWidth="0.8"
      />
    </svg>
  );
}

export function Laptop({ pose, screen, keysOn, keysLive, fingers, fingerMove }: Props) {
  const negElev = useTransform(pose.elev, (v) => -v);
  const pos = useMotionTemplate`translate3d(${pose.x}px, ${pose.y}px, 0) scale(${pose.scale})`;
  const rig = useMotionTemplate`rotateX(${negElev}deg) rotateY(${pose.yaw}deg)`;
  const lid = useMotionTemplate`translateZ(2px) rotateX(${pose.lid}deg)`;

  return (
    <motion.div className="lt-pos" style={{ transform: pos }}>
      <div className="lt-scene">
        <motion.div className="lt-rig" style={{ transform: rig }}>
          <div className="lt-deck">
            <div className="lt-shadow" />
            {baseLayers}
            <div className="lt-top">
              <div className="lt-hinge" />
              <div className="lt-scoop" />
              <Keyboard on={keysOn} live={keysLive} />
              <Trackpad fingers={fingers} move={fingerMove} />
              <motion.div className="lt-spill" style={{ opacity: pose.screenOn }} />
            </div>

            <motion.div className="lt-lid" style={{ transform: lid }}>
              {lidLayers}
              <div className="lt-lid-outer">
                <motion.div className="lt-heart-glow" style={{ opacity: pose.glow }} />
                <Heart />
              </div>
              <div className="lt-lid-inner">
                <div className="lt-glass" />
                <div className="lt-cam" />
                <div className="lt-screen">
                  <motion.div className="lt-screen-on" style={{ opacity: pose.screenOn, '--write': pose.write } as MotionStyle}>
                    {screen}
                  </motion.div>
                  <div className="lt-sheen" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
