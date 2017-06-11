import gulp from 'gulp';
import merge from 'merge-stream';
import changedInPlace from 'gulp-changed-in-place';
import project from '../aurelia.json';

export default function copyAudio() {
  const source = 'audio';

  const taskAudio = gulp.src(`${source}/**/*`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.platform.output}/audio`));

  return taskAudio;
}
