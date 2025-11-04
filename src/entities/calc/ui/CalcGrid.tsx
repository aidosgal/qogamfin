import React from "react";
import { StyleSheet, View } from "react-native";
import { CalcCard } from "./CalcCard";

const cards = [
    {
        title: "Ежедневный калькулятор",
        description: "Расчет ежедневного расхода",
        icon: "calendar",
        url: "/(calc)/daily",
    },
    {
        title: "Депозитный калькулятор",
        description: "Расчет депозита",
        icon: "trending-up",
        url: "/(calc)/deposit",
    },
    {
        title: "Ипотечный калькулятор",
        description: "Расчет ипотеки",
        icon: "home",
        url: "/(calc)/ipoteka",
    },
];

export const CalcGrid = () => {
    return (
        <View style={styles.container}>
            {cards.map((card, index) => (
                <CalcCard
                    key={index}
                    title={card.title}
                    description={card.description}
                    icon={card.icon}
                    url={card.url}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 30,
    },
});
