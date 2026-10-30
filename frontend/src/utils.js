export const topicStyle={
  Basics:{chip:"bg-saffron text-ink",band:"bg-saffron/20"},
  Markets:{chip:"bg-iris text-white",band:"bg-iris/10"},
  Investing:{chip:"bg-gain text-ink",band:"bg-gain/15"}
};
export const ts=t=>topicStyle[t]||topicStyle.Basics;
