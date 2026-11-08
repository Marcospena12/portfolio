export function BackgroundLights() {
  return (
    <div className="scene-lights" aria-hidden="true">
      <span className="scene-light-anchor scene-light-anchor--warm">
        <span className="scene-light scene-light--warm" />
      </span>
      <span className="scene-light-anchor scene-light-anchor--cool">
        <span className="scene-light scene-light--cool" />
      </span>
      <span className="scene-light-anchor scene-light-anchor--violet">
        <span className="scene-light scene-light--violet" />
      </span>
    </div>
  );
}
