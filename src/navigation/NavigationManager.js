export const navigationPoints = {};

export function findNavigationPoints(root) {

    root.traverse((child) => {

        if (child.name.startsWith("Nav_")) {

            const id = child.name.replace("Nav_", "");

            navigationPoints[id] = child;

        }

    });

    console.log(navigationPoints);

}