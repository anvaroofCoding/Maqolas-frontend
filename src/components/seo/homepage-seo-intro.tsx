import {
  HOMEPAGE_INTRO_COPY,
  homepageSeoIntroCardClassName,
  homepageSeoIntroGridClassName,
  homepageSeoIntroShellClassName,
} from "@/lib/seo/homepage-intro-copy";

type HomepageSeoIntroProps = {
  variant?: keyof typeof HOMEPAGE_INTRO_COPY;
};

export function HomepageSeoIntro({ variant = "home" }: HomepageSeoIntroProps) {
  const copy = HOMEPAGE_INTRO_COPY[variant];

  return (
    <header className={homepageSeoIntroShellClassName}>
      <div className={homepageSeoIntroGridClassName}>
        <div className="sm:col-span-2 lg:col-span-1">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl md:text-2xl">
            <span className="text-primary">{copy.headingAccent}</span>{" "}
            <span className="text-foreground">{copy.headingSuffix}</span>
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px] sm:leading-6">
            {copy.lead}
          </p>
        </div>

        {copy.columns.map((column) => (
          <div key={column.title} className={homepageSeoIntroCardClassName}>
            <h2 className="text-sm font-semibold text-foreground">{column.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {column.text}
            </p>
          </div>
        ))}
      </div>
    </header>
  );
}
