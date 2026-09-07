import Link from "next/link";
import type { Job } from "@/data/jobs";
import Button from "@/components/Button";

const EASYJOBS_URL = "https://career.efoli.com";

interface JobsProps {
  jobs?: Job[];
}

const Jobs = ({ jobs = [] }: JobsProps) => {
  return (
    <section>
      <div className="max-w-7xl mx-auto md:pb-30 pb-10 px-4">
        <h2 className="md:text-5xl/[1.192] text-3xl md:text-left text-center font-bold font-display">Find the Right Role<br /> Made for You</h2>

        {jobs.length > 0 ? (
          <div className="mt-10 flex flex-col gap-5">
            {jobs.map((job, index) => (
              <div key={job.id} className={`flex md:gap-6 gap-4 justify-between items-center text-[#13181E] pb-6 border-b border-[#c5c5c5] ${index === 0 ? 'pt-4 border-t' : ''}`}>
                <div className="flex flex-col gap-1">
                  <h4 className="md:text-[22px]/[1.36] text-base font-bold font-display md:w-[284px] flex-1">{job.title}</h4>
                  <p className="md:text-base text-sm">{job.location}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="md:text-[22px]/[1.36] text-base font-bold font-display">{job.deadline}</h4>
                  {job.vacancies ? (
                    <p className="md:text-base text-sm">Open roles: <strong>{job.vacancies}</strong></p>
                  ) : null}
                </div>
                <div>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      pClass="bg-[#0D99FF] rounded-xl px-8 py-3 text-white cursor-pointer text-sm font-bold font-display"
                      text1="Apply"
                      text2="Apply"
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No open positions — shown whenever easy.jobs has nothing live. */
          <div className="mt-10 rounded-2xl border border-[#e5e7eb] bg-gradient-to-r from-white to-[#f2fbfa] px-6 py-12 text-center md:py-16">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#0D99FF]/10">
              <svg className="h-7 w-7 text-[#0D99FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </span>

            <h3 className="mt-5 font-display text-xl md:text-2xl font-bold text-[#13181E]">
              We&rsquo;re currently not hiring
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-base/[1.7] text-[#4B5154]">
              There are no open positions right now. New roles are posted here as
              soon as they open &mdash; check back soon, or reach out and tell us
              how you&rsquo;d like to contribute.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact-us">
                <Button
                  pClass="bg-[#0D99FF] rounded-xl px-8 py-3 text-white cursor-pointer text-sm font-bold font-display"
                  text1="Get in touch"
                  text2="Get in touch"
                />
              </Link>
              <a
                href={EASYJOBS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#c5c5c5] px-8 py-3 text-sm font-bold font-display text-[#13181E] transition hover:border-[#0D99FF] hover:text-[#0D99FF]"
              >
                View careers portal
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Jobs;
