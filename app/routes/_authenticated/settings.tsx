import React, { useState } from "react";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import PageWrap from "@/components/page-wrap";
import ProfileSettings from "@/components/profileSettings/profile-settings";
import DisplaySettings from "@/components/displaySettings/display-settings";
import NotificationsSettings from "@/components/notificationsSettings/notifications-settings";
import PrivacySettings from "@/components/privacySettings/privacy-settings";
import DataManagementSettings from "@/components/dataManagementSettings/data-management-settings";
import GdprSettings from "@/components/gdprSettings/gdpr-settings";
import AccountStats from "@/components/accountStats/account-stats";

export const Route = createFileRoute("/_authenticated/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);

  return (
    <>
      <PageWrap
        title={"Settings"}
        subtitle="Customize your Video Game Organizer experience."
      />
      <div className="grid gap-6">
        <ProfileSettings
          username={name}
          email={email}
          onChangeUsername={setName}
          onChangeEmail={setEmail}
        />
        <DisplaySettings />
        {/* <NotificationsSettings />
        <PrivacySettings />
        <DataManagementSettings />
        <GdprSettings /> */}
        <AccountStats />
      </div>
    </>
  );
}
