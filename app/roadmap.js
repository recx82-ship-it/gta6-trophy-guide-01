// The roadmap to the platinum, in the order to play it. Each stage lists the
// trophy ids it covers, built from the official descriptions: story chapters
// and missions first, then side strands, then activities, then collectibles,
// then money and the 100% cleanup that ends in the platinum. The one
// missable trophy sits in Stage 1, where it belongs — do it in Chapter 1.
export const ROADMAP = [
  {
    stage: 1,
    title: 'Play the story',
    hours: '60–80 hours',
    blurb:
      'Chapters 1 to 5, in order. The story trophies pop as you go. Do the one missable meditation in Chapter 1 (Positive Mental Attitude) before the chapter ends, and keep a separate save at the start and end of every chapter — there is no mission replay.',
    trophyIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 28],
  },
  {
    stage: 2,
    title: 'Side characters & strangers',
    hours: 'during and after the story',
    blurb:
      'Finish the six character strands (Andy, Kenton, Billy, Randy, Tyrone, Bret) and eight stranger strands. Trophy-related quest givers stay available in free-roam after the story, so nothing here is missable.',
    trophyIds: [22, 23, 24, 25, 26, 27, 29],
  },
  {
    stage: 3,
    title: 'Activities & skills',
    hours: 'as you go, then cleanup',
    blurb:
      'Races, drone races, the shooting range, stunts, bowling, arcade, fishing, challenges and the combat and robbery trophies. Try each activity type once early for Master of None, then gold the 42 shooting-range challenges and win your 20 races.',
    trophyIds: [15, 16, 17, 18, 19, 20, 21, 32, 33, 34, 36, 37, 38, 39, 40, 41, 46, 47, 48, 51, 55],
  },
  {
    stage: 4,
    title: 'Collectibles & exploration',
    hours: 'during cleanup',
    blurb:
      'Meditate at all 18 spots, scan 100 WAiNK locations, discover 100 vehicles, complete 3 card sets, explore all 52 areas and buy all 8 garage properties. Scanning counts for both WAiNK and vehicle discovery, so do them together.',
    trophyIds: [30, 31, 35, 42, 54],
  },
  {
    stage: 5,
    title: 'Money, 100%, platinum',
    hours: 'the final cleanup',
    blurb:
      'Launder $250,000 of Marked Bills, spend $100,000 across shops, then open the 100% checklist (Progress, then Stats — it only appears after the story) and finish it line by line. A Long Road pops, and the platinum follows at once.',
    trophyIds: [52, 53, 14, 1],
  },
];

/** How many of a stage's trophies an earned set already holds. */
export function stageProgress(stage, earned, byId) {
  const done = stage.trophyIds.filter((id) => earned.has(byId.get(id).name)).length;
  return { done, total: stage.trophyIds.length };
}
