            //Dragging-Swapping Rules:
            //->Item1
            //->Item2
            //->AND/OR1
            //      ->Item3    
            //      ->Item4
            //      ->AND/OR2
            //            ->Item5
            //            ->Item6
            //            ->AND/OR3
            //                  ->Item7
            //                  ->Item8
            //->AND/OR4
            //      ->Item9
            //      ->Item10
            //      -->AND/OR5

            //1-If user drags filter Items (Not operators) over each other, they will be swapped,
            //disregarding the level.
            //i.e.: Item1 dragged over Item2 or any other item will result in swapping

            //2-If user drags filter Items or operators over operators, the target will have this item as its descendant, so no swapping here.
            //i.e.: Item1 or AND/OR3 dragged over AND/OR4 will yield them to be AND/OR4 descendants

            //3-Dragging an operator over a regular item is prohibited.


            //4-Dragging a parent operator over a child operator (same hierarchy branch is prohibited)
            //i.e. Cannot Drag AND/OR1 over AND/OR2 or AND/OR3 since they are on the same hierarchy branch. Can however drag AND/OR1 inside AND/OR4 or AND/OR5 
            //