"use client";

export function AccountSection() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-dark">Personal information</h3>
        <p className="mb-4 text-xs text-grey-400">
          Profile editing isn&apos;t available yet — message us on WhatsApp or email if you need
          your name, email, or phone updated.
        </p>
        <fieldset disabled className="grid grid-cols-2 gap-4 opacity-60">
          <div>
            <label className="mb-1 block text-sm text-grey-500">First name</label>
            <input className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-grey-500">Last name</label>
            <input className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm" />
          </div>
        </fieldset>
      </div>

      <div className="border-t border-grey-200 pt-6">
        <h3 className="mb-3 text-sm font-medium text-dark">Change password</h3>
        <p className="mb-4 text-xs text-grey-400">
          Self-serve password changes aren&apos;t available yet — see the &ldquo;Forgot
          password&rdquo; flow on the login page to request help from our team.
        </p>
        <fieldset disabled className="flex max-w-sm flex-col gap-4 opacity-60">
          <input
            type="password"
            placeholder="Current password"
            className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="New password"
            className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm"
          />
        </fieldset>
      </div>
    </div>
  );
}
