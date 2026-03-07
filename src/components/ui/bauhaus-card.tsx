import { ChronicleButton } from "@/components/ui/chronicle-button";

interface BauhausCardProps {
  id: string;
  accentColor: string;
  topInscription: string;
  mainText: string;
  subMainText: string;
  progressBarInscription: string;
  progress: number;
  progressValue: string;
  filledButtonInscription: string;
  outlinedButtonInscription: string;
  backgroundColor?: string;
  separatorColor?: string;
  topInscriptionColor?: string;
  mainTextColor?: string;
  subMainTextColor?: string;
  progressLabelColor?: string;
  progressValueColor?: string;
  progressBarBg?: string;
  chronicleBg?: string;
  chronicleFg?: string;
  chronicleHoverFg?: string;
  onFilledButtonClick?: () => void;
  onOutlinedButtonClick?: () => void;
}

export function BauhausCard({
  accentColor,
  topInscription,
  mainText,
  subMainText,
  progressBarInscription,
  progress,
  progressValue,
  filledButtonInscription,
  outlinedButtonInscription,
  backgroundColor = "var(--bauhaus-card-bg)",
  separatorColor = "var(--bauhaus-card-separator)",
  topInscriptionColor = "var(--bauhaus-card-inscription-top)",
  mainTextColor = "var(--bauhaus-card-inscription-main)",
  subMainTextColor = "var(--bauhaus-card-inscription-sub)",
  progressLabelColor = "var(--bauhaus-card-inscription-progress-label)",
  progressValueColor = "var(--bauhaus-card-inscription-progress-value)",
  progressBarBg = "var(--bauhaus-card-progress-bar-bg)",
  chronicleBg = "var(--bauhaus-chronicle-bg)",
  chronicleFg = "var(--bauhaus-chronicle-fg)",
  chronicleHoverFg = "var(--bauhaus-chronicle-hover-fg)",
  onFilledButtonClick,
  onOutlinedButtonClick,
}: BauhausCardProps) {
  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden w-72 shadow-md"
      style={{ backgroundColor }}
    >
      {/* Card preview area */}
      <div
        className="relative h-48 rounded-xl overflow-hidden mb-6"
        style={{
          background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}44 100%)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-full border-4 opacity-30"
            style={{ borderColor: accentColor }}
          />
          <div
            className="absolute w-12 h-12 rounded-full"
            style={{ backgroundColor: accentColor, opacity: 0.6 }}
          />
        </div>
        <div
          className="absolute top-4 right-4 w-3 h-3 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        {/* Top inscription */}
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: topInscriptionColor }}
        >
          {topInscription}
        </p>

        {/* Separator */}
        <div
          className="h-px w-full"
          style={{ backgroundColor: separatorColor }}
        />

        {/* Main text */}
        <h3
          className="text-lg font-bold leading-snug"
          style={{ color: mainTextColor }}
        >
          {mainText}
        </h3>

        {/* Sub text */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: subMainTextColor }}
        >
          {subMainText}
        </p>

        {/* Separator */}
        <div
          className="h-px w-full"
          style={{ backgroundColor: separatorColor }}
        />

        {/* Progress */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span style={{ color: progressLabelColor }}>
              {progressBarInscription}
            </span>
            <span style={{ color: progressValueColor }}>{progressValue}</span>
          </div>
          <div
            className="h-2 w-full rounded-full overflow-hidden"
            style={{ backgroundColor: progressBarBg }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
          </div>
        </div>

        {/* Separator */}
        <div
          className="h-px w-full"
          style={{ backgroundColor: separatorColor }}
        />

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <ChronicleButton
            inscription={filledButtonInscription}
            variant="filled"
            backgroundColor={chronicleBg}
            textColor={chronicleFg}
            hoverTextColor={chronicleHoverFg}
            onClick={onFilledButtonClick}
            className="flex-1"
          />
          <ChronicleButton
            inscription={outlinedButtonInscription}
            variant="outlined"
            backgroundColor={chronicleBg}
            textColor={subMainTextColor}
            hoverTextColor={chronicleHoverFg}
            borderColor={separatorColor}
            onClick={onOutlinedButtonClick}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
