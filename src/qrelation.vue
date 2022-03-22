<template>
	<div id="qflow_lay">
		<div class="tool">
			<span class="drag_ele" data-id="-1">
				<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjAyMjk3NTk0ODc5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxNDciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMjU2IDI4OGg2NHY2NGgtNjR6IG0xMjggMzg0aDM4NHY2NEgzODR6TTI1NiA0ODBoNjR2NjRoLTY0eiBtMCAxOTJoNjR2NjRoLTY0eiIgZmlsbD0iIzMzMzMzMyIgcC1pZD0iMjE0OCI+PC9wYXRoPjxwYXRoIGQ9Ik04MzIgNjRIMTkyYy0zNS4yIDAtNjQgMjguOC02NCA2NHY3NjhjMCAzNS4yIDI4LjggNjQgNjQgNjRoNjQwYzM1LjIgMCA2NC0yOC44IDY0LTY0VjEyOGMwLTM1LjItMjguOC02NC02NC02NHogbTAgODAwYzAgMTkuMi0xNiAzMi0zMiAzMkgyMjRjLTE2IDAtMzItMTIuOC0zMi0zMlYxNjBjMC0xOS4yIDE2LTMyIDMyLTMyaDU3NmMxNiAwIDMyIDEyLjggMzIgMzJ2NzA0eiIgZmlsbD0iIzMzMzMzMyIgcC1pZD0iMjE0OSI+PC9wYXRoPjxwYXRoIGQ9Ik0zODQgNDgwaDM4NHY2NEgzODR6IG0wLTE5MmgzODR2NjRIMzg0eiIgZmlsbD0iIzMzMzMzMyIgcC1pZD0iMjE1MCI+PC9wYXRoPjwvc3ZnPg==" height="20" alt="" draggable="false">
			</span>
			<span class="drag_ele" data-id="1">
				<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjAyMjk3ODY3NDcwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM1MjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNDU4LjIgMzcxSDExMi42Qzg2LjkgMzcxIDY2IDM1MC4xIDY2IDMyNC41VjE2NC45YzAtMjUuNyAyMC45LTQ2LjUgNDYuNS00Ni41aDM0NS42YzI1LjcgMCA0Ni41IDIwLjkgNDYuNSA0Ni41djE1OS41YzAuMSAyNS43LTIwLjggNDYuNi00Ni40IDQ2LjZ6TTExMi42IDE1OC4zYy0zLjYgMC02LjYgMy02LjYgNi42djE1OS41YzAgMy42IDMgNi42IDYuNiA2LjZoMzQ1LjZjMy42IDAgNi42LTMgNi42LTYuNlYxNjQuOWMwLTMuNi0zLTYuNi02LjYtNi42SDExMi42ek05MTAuMSA5MDhIMjU4LjhjLTI1LjcgMC00Ni41LTIwLjktNDYuNS00Ni41VjUxNS45YzAtMjUuNyAyMC45LTQ2LjUgNDYuNS00Ni41aDY1MS4zYzI1LjcgMCA0Ni41IDIwLjkgNDYuNSA0Ni41djM0NS42YzAgMjUuNy0yMC44IDQ2LjUtNDYuNSA0Ni41ek0yNTguOCA1MDkuMmMtMy42IDAtNi42IDMtNi42IDYuNnYzNDUuNmMwIDMuNiAzIDYuNiA2LjYgNi42aDY1MS4zYzMuNiAwIDYuNi0zIDYuNi02LjZWNTE1LjljMC0zLjYtMy02LjYtNi42LTYuNkgyNTguOHoiIGZpbGw9IiM0RjRGNEYiIHAtaWQ9IjM1MjciPjwvcGF0aD48cGF0aCBkPSJNMjI1LjUgNjk1LjNoLTU5LjNjLTE4LjMgMC0zMy4yLTE0LjktMzMuMi0zMy4xbC0wLjUtMzA1LjhjMC0xMSA4LjktMjAgMTkuOS0yMCAxMSAwIDE5LjkgOC45IDE5LjkgMTkuOWwwLjUgMjk5LjFoNTIuN2MxMSAwIDE5LjkgOC45IDE5LjkgMTkuOXMtOC44IDIwLTE5LjkgMjB6IiBmaWxsPSIjNEY0RjRGIiBwLWlkPSIzNTI4Ij48L3BhdGg+PC9zdmc+" height="20" alt="" draggable="false">
			</span>
			<span class="drag_ele" data-id="2">
				<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjAzMDgxOTIxMDg0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMxMjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNjQuNzEzODg0IDY1MC40MDQyMWw4OTIuNjg0MjMyIDAgMCA1NS4wNTM4NzMtODkyLjY4NDIzMiAwIDAtNTUuMDUzODczWiIgcC1pZD0iMzEyMiI+PC9wYXRoPjxwYXRoIGQ9Ik01MTEuMDU3NTM1IDIzNy40ODc4NzlsNDQ2LjM0MDU4MSAwIDAgNTUuMDU2OTQzLTQ0Ni4zNDA1ODEgMCAwLTU1LjA1Njk0M1oiIHAtaWQ9IjMxMjMiPjwvcGF0aD48cGF0aCBkPSJNMTg5LjIyNTY4OSA0ODQuMzY3NjYzbDE4OC45NTM0OSAwIDQ2LjI4ODIzMyAxMTQuNzQ4NDQxIDY0Ljc0MTUxMyAwTDMxNi4zNjk0MzggMTc5LjkwNDM5M2wtNjIuNjk0OTAxIDBMODAuODMzMDAzIDU5OS4xMTYxMDNsNjQuNzQzNTYgMEwxODkuMjI1Njg5IDQ4NC4zNjc2NjN6TTI3NS42NDkwMTQgMjYyLjcxOTU0YzIuNzMxMjA0LTYuODU2MTUyIDUuMTcyODEzLTE2LjU5NzAwMyA3LjMxOTcwOS0yOS4yMjk3MThsMS40Njc0MjEgMGMyLjUzNTc1MyAxMy44OTU0NzUgNC44ODAxNDcgMjMuNjM2MzI3IDcuMDMwMTE0IDI5LjIyOTcxOGw2OC41NDkyMzYgMTc0LjI4ODQ4OEwyMDcuNjgyMDQgNDM3LjAwODAyOSAyNzUuNjQ5MDE0IDI2Mi43MTk1NHoiIHAtaWQ9IjMxMjQiPjwvcGF0aD48cGF0aCBkPSJNNTExLjA1NzUzNSAzNzUuMTI4NzAzbDQ0Ni4zNDA1ODEgMCAwIDU1LjA1Mzg3My00NDYuMzQwNTgxIDAgMC01NS4wNTM4NzNaIiBwLWlkPSIzMTI1Ij48L3BhdGg+PHBhdGggZD0iTTY0LjcxMzg4NCA3ODguMDQwOTRsODkyLjY4NDIzMiAwIDAgNTUuMDU0ODk3LTg5Mi42ODQyMzIgMCAwLTU1LjA1NDg5N1oiIHAtaWQ9IjMxMjYiPjwvcGF0aD48cGF0aCBkPSJNNTExLjA1NzUzNSA1MTIuNzY2NDU2bDQ0Ni4zNDA1ODEgMCAwIDU1LjA1NDg5Ny00NDYuMzQwNTgxIDAgMC01NS4wNTQ4OTdaIiBwLWlkPSIzMTI3Ij48L3BhdGg+PC9zdmc+" height="20" alt="" draggable="false">
			</span>
			
			
			<span class="save" @click="save">
				<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjAyMjk4MDA1NzAyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ0MTQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODk1LjgzIDYyLjEwMmMzMS43NjEgNS4yOTQgNTIuOTM1IDI2LjQ2OCA2MC44NzYgNTIuOTM1IDcuOTQgMTguNTI3IDUuMjk0IDgyLjA0OSA1LjI5NCAxMDguNTE3djYxNi42OTVjMCAxOC41MjcgMCA0Mi4zNDktMi42NDcgNTUuNTgyLTIuNjQ3IDMxLjc2MS0yMy44MjEgNTIuOTM1LTUwLjI4OCA2MC44NzYtMTguNTI3IDcuOTQtODQuNjk3IDUuMjk0LTEwOC41MTcgNS4yOTQtMjA2LjQ0NyAwLTQxMi44OTUgMC02MTkuMzQyIDAtMTUuODgxIDAtMzkuNzAxIDAtNTUuNTgyLTIuNjQ3LTI5LjExNS0yLjY0Ny01Mi45MzUtMjMuODIxLTYwLjg3Ni01MC4yODgtNS4yOTQtMTguNTI3LTIuNjQ3LTg0LjY5Ny0yLjY0Ny0xMDguNTE3di02MTkuMzQyYzAtMTUuODgxIDAtMzcuMDU1IDAtNTIuOTM1IDUuMjk0LTMxLjc2MSAyNi40NjctNTIuOTM1IDUyLjkzNS02My41MjIgMTguNTI3LTUuMjk0IDgyLjA0OS0yLjY0NyAxMDguNTE3LTIuNjQ3IDIwNi40NDcgMCA0MTAuMjQ4IDAgNjE2LjY5NSAwIDE1Ljg4MSAwIDM5LjcwMSAwIDU1LjU4MiAwek0zMzQuNzE5IDM2MS4xODZoMzU0LjY2NmMxMC41ODcgMCAxMy4yMzQtNS4yOTQgMTMuMjM0LTEzLjIzNHYtMjMwLjI2OGgtMzgxLjEzM3YyMjIuMzI4YzAgMTUuODgxLTIuNjQ3IDIxLjE3MyAxMy4yMzQgMjEuMTczek03NTguMiAxMTcuNjg0djI0OC43OTZjMCAzNy4wNTUtNy45NCA1MC4yODgtNDQuOTk0IDUwLjI4OC05Ny45MyAwLTM3MC41NDYgMC00MTguMTg4IDAtMjEuMTczIDAtMjkuMTE1LTEwLjU4Ny0yOS4xMTUtMzcuMDU1di0yNjIuMDI5Yy0zMS43NjEgMC04NC42OTcgMC0xMTYuNDU4IDAtMTUuODgxIDAtMjYuNDY3IDAtMjkuMTE1IDEwLjU4Ny0yLjY0NyA3Ljk0LTIuNjQ3IDEzNy42MzItMi42NDcgMTU2LjE1OHY1OTIuODc0YzAgMTMuMjM0IDAgMjMuODIxIDEzLjIzNCAyNi40NjcgNS4yOTQgMi42NDcgMTM3LjYzMiAyLjY0NyAxNTYuMTU4IDIuNjQ3IDUyLjkzNSAwIDU4LjIyOCAwIDExMS4xNjQgMHYtMTc5Ljk3OWgyMjcuNjIxdjE3OS45NzljNzQuMTA5IDAgMTExLjE2NCAwIDE4Ny45MiAwIDEwLjU4NyAwIDc0LjEwOSAwIDc5LjQwMy0yLjY0NyAxMC41ODctMi42NDcgMTMuMjM0LTEwLjU4NyAxMy4yMzQtMjYuNDY3di02NjkuNjNjMC0xMy4yMzQgMC02OC44MTUtMi42NDctNzYuNzU2LTIuNjQ3LTEzLjIzNC0xOC41MjctMTMuMjM0LTI2LjQ2Ny0xMy4yMzQtMzQuNDA4IDAtODQuNjk3IDIuNjQ3LTExOS4xMDQgMHpNNDUzLjgyMyA5MDMuNzcybDExNi40NTggMi42NDd2LTEyNC4zOThoLTExNi40NTh2MTIxLjc1MXoiIHAtaWQ9IjQ0MTUiPjwvcGF0aD48L3N2Zz4="
				height="20" alt="" draggable="false">

			</span>
			<span class="download" @click="download">
				<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjAyMzk1NTUzNjQwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI0MDkiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODMyLjEgNTkyLjdjLTExIDAtMjAgOS0yMCAyMHYxNTEuMmMwIDExLTkgMjAtMjAgMjBIMjMxLjljLTExIDAtMjAtOS0yMC0yMFY2MTIuN2MwLTExLTktMjAtMjAtMjBzLTIwIDktMjAgMjB2MTUxLjJjMCAzMy4xIDI2LjkgNjAgNjAgNjBINzkyYzMzLjEgMCA2MC0yNi45IDYwLTYwVjYxMi43YzAuMS0xMS04LjktMjAtMTkuOS0yMHoiIHAtaWQ9IjI0MTAiPjwvcGF0aD48cGF0aCBkPSJNNDY4LjMgNjU4LjZjMTEuMyAxMS45IDI3LjIgMTguNyA0My42IDE4LjcgMTYuNCAwIDMyLjMtNi44IDQzLjYtMTguOGw5OS4xLTEwNC43YzcuNi04IDcuMi0yMC43LTAuOC0yOC4zLTgtNy42LTIwLjctNy4yLTI4LjMgMC44bC05My42IDk4LjlWMjIwYzAtMTEtOS0yMC0yMC0yMHMtMjAgOS0yMCAyMHY0MDUuMmwtOTMuNC05OC42Yy03LjYtOC0yMC4zLTguNC0yOC4zLTAuOC04IDcuNi04LjQgMjAuMy0wLjggMjguM2w5OC45IDEwNC41eiIgcC1pZD0iMjQxMSI+PC9wYXRoPjwvc3ZnPg==" height="20" alt="" draggable="false">
			</span>
			<span class="json" @click="jsShow">
				<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjAzMzgyNzgzMzY1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MjgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMjE2LjQgMTA3LjFoNTAuMmM1LjcgMCAxMC40IDQuNyAxMC40IDEwLjRWMTU2YzAgNS43LTQuNyAxMC40LTEwLjQgMTAuNGgtNDUuOGMtNS43IDAtMTMuNCA0LjYtMTMuNCAxMC40bC0xIDI0Ni42Yy0xLjMgMzUuMi0yNS4xIDkwLTU4LjYgOTEuNCAyMy4yLTEgNTkuNiAzOS41IDU5LjYgODkuNGwtMSAyNDIuNGMwIDUuOCA0LjcgMTkuNiAxMC42IDE5LjZoNDkuM2M1LjkgMCAxMC44IDYuOCAxMC44IDEyLjh2MzAuOWMwIDUuOS00LjggMTAuOC0xMC44IDEwLjhoLTQ5LjhjLTMyLjQtMTIuMi02MC42LTQwLjctNjAuNi05MC40di0xODFjMC00OS45LTI3LjEtOTAuNC02MC42LTkwLjRINzcuMWMtNi44IDAtMTIuMi01LjUtMTIuMi0xMi4ydi02NS45YzAtNi44IDUuNS0xMi4yIDEyLjItMTIuMmgxOC4xYzMzLjUgMCA2MC42LTQwLjUgNjAuNi05MC40VjE5Ny40YzAtNDkuOSAyNy4xLTkwLjMgNjAuNi05MC4zTTgwOC42IDEwNy4xYzMzLjUgMCA2MC42IDQwLjQgNjAuNiA5MC4zdjE4MC44YzAgNDkuOSAyNy4xIDkwLjQgNjAuNiA5MC40aDE4LjFjNi43IDAgMTIuMiA1LjQgMTIuMiAxMi4ydjY1LjljMCA2LjctNS40IDEyLjItMTIuMiAxMi4yaC0xOC4yYy0zMy41IDAtNjAuNiA0MC41LTYwLjYgOTAuNHYxODFjMCA0OS43LTI4LjIgNzguMi02MC42IDkwLjRoLTQ5LjhjLTYgMC0xMC44LTQuOS0xMC44LTEwLjhWODc5YzAtNiA0LjktMTIuOCAxMC44LTEyLjhIODA4YzUuOSAwIDEwLjYtMTMuOCAxMC42LTE5LjZsLTEtMjQyLjRjMC00OS45IDM2LjQtOTAuNCA1OS42LTg5LjQtMzMuNS0xLjQtNTcuMy01Ni4yLTU4LjYtOTEuNGwtMS0yNDYuNmMwLTUuOC03LjctMTAuNC0xMy40LTEwLjRoLTQ1LjhjLTUuNyAwLTEwLjQtNC43LTEwLjQtMTAuNHYtMzguNWMwLTUuNyA0LjctMTAuNCAxMC40LTEwLjRoNTAuMk01MDguNCA2NjcuOGMxNi44IDAgMzAuNCAxMy42IDMwLjQgMzAuNCAwIDE2LjgtMTMuNiAzMC40LTMwLjQgMzAuNC0xNi44IDAtMzAuNC0xMy42LTMwLjQtMzAuNCAwLTE2LjggMTMuNi0zMC40IDMwLjQtMzAuNE0zODYuOCA2NjcuOGMxNi44IDAgMzAuNCAxMy42IDMwLjQgMzAuNCAwIDE2LjgtMTMuNiAzMC40LTMwLjQgMzAuNC0xNi44IDAtMzAuNC0xMy42LTMwLjQtMzAuNCAwLTE2LjggMTMuNi0zMC40IDMwLjQtMzAuNE02MzAgNjY3LjhjMTYuOCAwIDMwLjQgMTMuNiAzMC40IDMwLjQgMCAxNi44LTEzLjYgMzAuNC0zMC40IDMwLjQtMTYuOCAwLTMwLjQtMTMuNi0zMC40LTMwLjQgMC0xNi44IDEzLjYtMzAuNCAzMC40LTMwLjR6IiBwLWlkPSIyNzI5Ij48L3BhdGg+PC9zdmc+"
				height="20" alt="" draggable="false">

			</span>


		</div>
		<div id="qcanvas_lay" v-bind:style="{'height':initHeight+'px'}">
			<canvas id="qcanvas"></canvas>
			<input type="text" id="titleInput" v-model="nodeTitle" @input="modiTitle" autocomplete="off" @keyup.enter="onSubmit">
			<input type="text" id="containerGridColumn" v-model.number="containerGridColumn" @input="modiContainerGridColumn" autocomplete="off">
			<textarea name="" id="tip" v-model="tipText" @input="modTip($event)"></textarea>

			<input type="text" id="lineTitleInput" v-model="lineNodeTitle" @input="modiLineTitle" autocomplete="off">
			<select id="lineLike" v-model="lineLike" @change="modiLineLike" autocomplete="off">
				<option v-for="item in lineStyleList" :value="item.value">{{item.name}}</option> 
			</select>
			<select id="lineType" v-model="lineType" @change="modiLineType" autocomplete="off">
				<option v-for="item in lineTypeList" :value="item.value">{{item.name}}</option> 
			</select>

			<!-- <div class="sheetLay">
				<span v-for="item in sheets">{{item.name}}</span>
			</div> -->
		</div>

		<el-dialog
		    title="json数据"
		    :visible.sync="show"
		    width="30%"
		    :custom-class="'codeView'"
		    @close="close">
		    <div class="json_lay">
		    	<!-- {{json}} -->
			          <JsonView v-if="show"  :json="returnObj()" class="JsonView"></JsonView>

		    </div>
		    
		</el-dialog>
	</div>
</template>
<script> 
import Vue from 'vue';

	import {Dialog} from 'element-ui'
	Vue.use(Dialog);
	import {Drag} from './lib/Drag.js'; 
	import {Qflow} from './lib/Qflow.js';

	import JsonView from './JsonView.vue';

	var qflow;

	export default{
		name:"qrelation",
		components:{JsonView},
		props:['initWidth','initHeight','jsonData','saveFun'],
		data(){
			return {
			  	curr:0,
			  	sheets:[
			  		{
			  			name:'sheet1',
			  		}
			  	],
	  			nodeTitle:'',
	  			lineNodeTitle:'标题',
	  			lineType:'',
	  			lineTypeList:[
	  				{
		  				name:'直线',
		  				value:'line'
	  				},
	  				{
		  				name:'二次曲线',
		  				value:'quadraticCurve'
	  				},
	  				{
		  				name:'三次曲线',
		  				value:'bezierCurve'
	  				},
	  				{
		  				name:'折线(横向)',
		  				value:'foldLine1'
	  				},
	  				{
		  				name:'折线(竖向)',
		  				value:'foldLine2'
	  				}
	  			],
	  			lineLike:'',
	  			lineStyleList:[
	  				{
	  					name:'-',
	  					value:'-'
	  				},
	  				{
	  					name:'->',
	  					value:'->'
	  				},
	  				{
	  					name:'<-',
	  					value:'<-'
	  				},
	  				{
	  					name:'<->',
	  					value:'<->'
	  				},
	  				{
	  					name:'--',
	  					value:'--'
	  				},
	  				{
	  					name:'<--',
	  					value:'<--'
	  				},
	  				{
	  					name:'-->',
	  					value:'-->'
	  				},
	  				{
	  					name:'<-->',
	  					value:'<-->'
	  				},
	  			],
	  			containerGridColumn:1,
	  			show:false,
	  			json:'',
	  			tipText:''

		  }
		},
		methods:{
			returnObj:function(){
				return JSON.parse(this.json);
			},
			onSubmit:function(){
		  		qflow.contextSettingHide();
		  	},
			jsShow:function(){
				this.json = JSON.stringify(qflow.returnSaveData());
				this.show = true;
			},
			close:function(){
				this.show = false
			},
			download:function(){
		  		qflow.download();
		  	},
			save:function(){ 

		  		this.saveFun && this.saveFun(qflow.returnSaveData());
		  	},	
		  	modiTitle:function(){
		  		qflow.modiTitle(this.nodeTitle);
		  	},
		  	modiLineTitle:function(){
		  		qflow.modiLineTitle(this.lineNodeTitle);
		  	},
		  	modiLineLike:function(){
		  		qflow.modiLineLike(this.lineLike);
		  	},
		  	modiLineType:function(){

		  		qflow.modiLineType(this.lineType);
		  	},
		  	modTip:function(e){
		  		var elem = e.target;
		  		elem.style.height = 'auto';
	            elem.scrollTop = 0; //防抖动
	            elem.style.height = elem.scrollHeight + 'px'; 

	            qflow.updateTipText(elem.value,parseInt(elem.style.height));

		  		// console.log(this.tipText);
		  		// var tip = document.getElementById('tip');
		  		// tip.style.height = tip.scrollTop + tip.scrollHeight + "px";

		  		// this.tipText = this.tipText.replace(/ /g, '');

		  		// // qflow.updateTipText(this.tipText.replace(/\r\n/g, '\n'),parseInt(tip.style.height));
		  		// qflow.updateTipText(this.tipText.replace(/\r\n/g, ''),parseInt(tip.style.height));


		  	},
		  	modiContainerGridColumn:function(){

		  		if(this.containerGridColumn =='' || 
		  			this.containerGridColumn ==0){

		  			return false;
		  		} 
			  	qflow.modiContainerGridColumn(this.containerGridColumn);
		  		

		  	},
		  	init:function(){
		  		var _this = this;
		  		qflow = new Qflow({
					id:'qcanvas',
					width:_this.initWidth,
					height:_this.initHeight,
					initData:_this.jsonData[_this.curr],
					// Qcanvas:Qcanvas
					});

				new Drag({ 
			          dragAimClass:"drag_ele",
			          moveFun:(x,y)=>{ 
			          	// console.log(x,y);
			          },
			          upFun:(obj)=>{ 
			          	if(obj.y > 40 && obj.x>0){

			          		//转换到画布的坐标
			          		// obj.y +=document.getElementById('qcanvas_lay').scrollTop;
			          		// obj.x +=document.getElementById('qcanvas_lay').scrollLeft;

				 			qflow.addEle(obj);
			          	}

			          }
			      })
		  	}

		},
		mounted(){
			// console.log(Drag);
			// console.log(Qcanvas);

			this.init();
		},
		created(){
			
		},
		computed:{

		},
		watch:{

		},
		// 销毁监听事件
		destroyed() {
		  qflow !== null & qflow.destroy();

		  qflow = null;
		}
	}

</script>
<style scoped>
.json_lay{
	    padding: 10px;
    height: 200px;
    overflow: scroll;
}
#qflow_lay{ 
			position: relative;
		}
.clear:after{
			content: "";
			display: block;
			clear: both;
			font-size: 0;
			line-height: 0;
		}
		canvas{ 
			height: 100%;
			width: 100%;
			background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QwZDBkMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDBkMGQwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=");

		}
		.tool{
			height: 40px;
			position: relative;
			z-index: 1;
			line-height: 40px;
			background-color: #fff;

		}
		.tool span{
			display: inline-block;
			width: 30px;
			height: 30px;
			text-align: center;
			margin-top:5px;
			margin-left:10px;
		} 
		.tool span img{
			pointer-events: none;
		}


		#qcanvas_lay{
			position: absolute;
			top:0;
			left:0;
			width: 100%;
			bottom: 0;
			overflow:scroll;
		}
		.sheetLay{
			font-size: 12px;
			position: absolute;
			bottom: 0;
			left:0;
			background: #fff;

		}
		.json,
		.save,
		.download{
			float: right;
			font-size: 12px;
		}
		#titleInput{
			position: absolute;
			left:0;
			top:0;
			padding: 0;
			margin:0;
			border:none; 
			font-size: 12px;
			font-family:'Microsoft YaHei';
			outline: none;
			background: #FDF8E1;
		}
		#lineTitleInput,
		#containerGridColumn,
		#lineLike,
		#lineType{
			position: absolute;
			left:0;
			top:0;
			padding: 0;
			margin:0;
			border:none;
			text-indent: 5px;
			font-size: 12px;
		}
#tip{
			position: absolute;
		    z-index: 1;
		    padding:0;
		    margin:0;
		    outline: none;
		    display: none;
		    font-family:'Microsoft YaHei';
		    /* font-family: 'Arial'; */
			word-break: break-all;
		    border:transparent;
		    overflow: hidden; 
		    background: rgba(0,0,0,0);
		    resize:none;
		    /*pointer-events: none;*/
		}

</style>
<style>
	.codeView .el-dialog__body{
	padding:5px;
}
</style>