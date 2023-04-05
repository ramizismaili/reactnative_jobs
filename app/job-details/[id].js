import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";
import { icons, COLORS, SIZES } from "../../constants";
import useFetch from "../../hook/useFetch";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { useCallback, useState } from "react";

// Define the tab names for the job details view
const tabs = ["About", "Qualifications", "Responsibilities"];

const JobDetails = () => {
  // Get the search params and router object using the expo-router library
  const params = useSearchParams();
  const router = useRouter();

  // Define state variables for refreshing status and active tab
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Function to handle pull-to-refresh functionality
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);

  // Function to display the appropriate content based on the active tab
  const displayTabContent = () => {
    switch (activeTab) {
      case "Qualifications":
        return (
          <Specifics
            title="Qualifications"
            points={data[0].job_highlights?.Qualifications ?? ["N/A"]}
          />
        );

      case "About":
        return (
          <JobAbout info={data[0].job_description ?? "No data provided"} />
        );

      case "Responsibilities":
        return (
          <Specifics
            title="Responsibilities"
            points={data[0].job_highlights?.Responsibilities ?? ["N/A"]}
          />
        );

      default:
        return null;
    }
  };

  // Fetch job details data using the useFetch custom hook
  const { data, isLoading, error, refetch } = useFetch("job-details", {
    job_id: params.id,
  });

  // Render the job details screen
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      {/* Render the header */}
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn
              iconUrl={icons.share}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerTitle: "",
        }}
      />

      {/* Render the main view */}
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Conditionally render content based on fetch status */}
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something Went Wrong!</Text>
          ) : data.length === 0 ? (
            <Text>No Data!</Text>
          ) : (
            <View style={{ padding: SIZES.mediumm, paddingBottom: 100 }}>
              {/* Render company information */}
              <Company
                companyLogo={data[0].employer_logo}
                jobTitle={data[0].job_title}
                companyName={data[0].employer_name}
                location={data[0].job_country}
              />

              {/* Render tab navigation */}
              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {/* Render tab content based on active tab */}
              {displayTabContent()}
            </View>
          )}
        </ScrollView>

        {/* Render the job footer with a link to apply for the job */}
        <JobFooter
          url={
            data[0]?.job_google_link ??
            "https://careers/google.com/jobs/results"
          }
        />
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
