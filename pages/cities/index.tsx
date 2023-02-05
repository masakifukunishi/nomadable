import { GetStaticProps } from "next";
import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { callFetchCitiesWithData } from "../../calls/placeCalls";
import { callFetchContributersArea } from "../../calls/userCalls";
import { CitiesSection } from "../../components/cities/CitiesSection";
import HeadSetter from "../../components/commons/HeadSetter";
import { Layout } from "../../components/commons/Layout";
import {
  APP_NAME,
  APP_URL,
  PATH_CITIES,
  CONTAINER_WIDTH_NORMAL,
} from "../../constants";
import { CityWithData, CITIES } from "../../data/articles/cities";
import { Contributer } from "../../redux/slices/contributerSlice";
import { forMobile } from "../../styles/Responsive";

interface Props {
  citiesWithData: CityWithData[];
  totalPlaceCnt: number;
  contributers: Contributer[];
}

const Cities: React.FC<Props> = (props) => {
  const [_citiesWithData, setCitiesWithData] = useState<CityWithData[]>(
    props.citiesWithData || []
  );
  const [_totalPlaceCnt, setTotalPlaceCnt] = useState<number>(
    props.totalPlaceCnt || 0
  );
  const [_contributers, setContributers] = useState(props.contributers || []);

  const generatePageDescription = () => {
    return `
      Find best places to work from wherever you are: 
      ${_citiesWithData
        .map((city, index) => ` ${index + 1}. ${city.city}`)
        .join(" · ")}.
    `;
  };

  const fetchData = async () => {
    const { citiesWithData, totalPlaceCnt } = await callFetchCitiesWithData(
      CITIES
    );
    setCitiesWithData(citiesWithData);
    setTotalPlaceCnt(totalPlaceCnt);
  };

  const fetchContributers = async () => {
    const {
      data: { contributers },
    } = await callFetchContributersArea(null, 10);

    setContributers(contributers);
  };

  useEffect(() => {
    fetchData();
    fetchContributers();
  }, [null]);

  return (
    <Layout width={CONTAINER_WIDTH_NORMAL} fixed>
      <HeadSetter
        pageTitle={`Cities | ${APP_NAME}`}
        pageDescription={generatePageDescription()}
        pagePath={`${APP_URL}/${PATH_CITIES}`}
      />
      <PageWrapper>
        <LeftWrapper>
          <CitiesSection
            citiesWithData={_citiesWithData}
            totalPlaceCnt={_totalPlaceCnt}
          />
        </LeftWrapper>
      </PageWrapper>
    </Layout>
  );
};

export default Cities;

export const getStaticProps: GetStaticProps = async ({}) => {
  try {
    const { citiesWithData, totalPlaceCnt } = await callFetchCitiesWithData(
      CITIES
    );

    const {
      data: { contributers },
    } = await callFetchContributersArea(null, 10);

    return {
      props: {
        citiesWithData,
        totalPlaceCnt,
        contributers,
      },
      revalidate: 1, // regenerate the static page on the access after 1 second later from the previous access
    };
  } catch (err: any) {
    return {
      props: {
        citiesWithData: [],
        totalPlaceCnt: 0,
        contributers: [],
      },
    };
  }
};

const PageWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;

  ${forMobile(`
    flex-direction: column;
    gap:0;
  `)}
`;

const LeftWrapper = styled.div``;
